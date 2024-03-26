var fs = require('fs');
var SQL = window.SQL;

// Încărcați baza de date existentă din fișier
var filebuffer = fs.readFileSync('calendar.db');

// Încărcați baza de date în memorie
var db = new SQL.Database(filebuffer);

// Funcție care salvează baza de date în memorie pe disc
function salveazaBazaDeDate() {
    var data = db.export();
    window.api.send('salveazaBazaDeDate', data);
}

document.addEventListener('DOMContentLoaded', function() {
    var calendarEls = document.getElementsByClassName('calendar');
    var calendare = {};

    for (var i = 0; i < calendarEls.length; i++) {
        var calendar = new FullCalendar.Calendar(calendarEls[i], {
            initialView: 'timeGridDay',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,dayGridMonth'
            },
            selectable: true,
            select: function(info) {
                var nume = prompt('Introduceți numele oaspetelui:');
                var telefon = prompt('Introduceți numărul de telefon al oaspetelui:');
                var tipRezervare = prompt('Introduceți tipul rezervării:');
                var numarOaspeti = prompt('Introduceți numărul de oaspeți:');
                var alteDetalii = prompt('Introduceți alte detalii:');
                var camera = prompt('Introduceți numărul camerei (pentru camera deluxe, introduceți "Deluxe"):');
            
                var newEvent = {
                    title: nume,
                    start: info.startStr,
                    end: info.endStr,
                    extendedProps: {
                        telefon: telefon,
                        tipRezervare: tipRezervare,
                        numarOaspeti: numarOaspeti,
                        alteDetalii: alteDetalii,
                        camera: camera
                    }
                };

                calendar.addEvent(newEvent);
            
                var calendarCamera = calendare["camera" + camera];
                if (!calendarCamera && camera.toLowerCase() === "deluxe") {
                    calendarCamera = calendare["cameraDeluxe"];
                }
                if (calendarCamera) {
                    calendarCamera.addEvent(newEvent);
                }
            
                // Adăugați rezervarea în baza de date
                var stmt = db.prepare("INSERT INTO rezervari VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                stmt.run(nume, telefon, tipRezervare, numarOaspeti, alteDetalii, camera, info.startStr, info.endStr);
                stmt.free();
            
                // Salvați baza de date pe disc
                salveazaBazaDeDate();
            },
            
            eventClick: function(info) {
                alert('Detalii rezervare:\n' +
                    'Nume: ' + info.event.title + '\n' +
                    'Telefon: ' + info.event.extendedProps.telefon + '\n' +
                    'Tip rezervare: ' + info.event.extendedProps.tipRezervare + '\n' +
                    'Număr oaspeți: ' + info.event.extendedProps.numarOaspeti + '\n' +
                    'Alte detalii: ' + info.event.extendedProps.alteDetalii + '\n' +
                    'Camera: ' + info.event.extendedProps.camera);
                
                // Salvați baza de date pe disc
                salveazaBazaDeDate();
            }
        });

        calendar.render();
        calendare[calendarEls[i].id] = calendar;
    }

    // Interogați baza de date pentru a obține rezervările existente
    var rezervari = db.exec("SELECT * FROM rezervari");

    for (var i = 0; i < rezervari[0].values.length; i++) {
        var rezervare = rezervari[0].values[i];
        var newEvent = {
            title: rezervare[1], // nume
            start: rezervare[7], // data_start
            end: rezervare[8], // data_end
            extendedProps: {
                telefon: rezervare[2], // telefon
                tipRezervare: rezervare[3], // tip_rezervare
                numarOaspeti: rezervare[4], // numar_oaspeti
                alteDetalii: rezervare[5], // alte_detalii
                camera: rezervare[6] // camera
            }
        };

        var calendarCamera = calendare["camera" + rezervare[6]];
        if (!calendarCamera && rezervare[6].toLowerCase() === "deluxe") {
            calendarCamera = calendare["cameraDeluxe"];
        }
        if (calendarCamera) {
            calendarCamera.addEvent(newEvent);
        }
    }
});
