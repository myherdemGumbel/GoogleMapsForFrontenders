let map;
let markers = [];
let infowindows = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(-33.91722, 151.23064),
        zoom: 16,
        styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ visibility: "off" }],
            },
          ],
    });

    const icons = {
        epc: {
            icon: "images/ikon1.png",
        },
        project: {
            icon: "images/ikon2.png",
        },
        operation: {
            icon: "images/ikon3.png",
        },
    };

    // Fetch projects from JSON file.
    fetch("projects.json")
        .then((response) => response.json())
        .then((data) => {
            // Create markers.
            for (let i = 0; i < data.length; i++) {
                const marker = new google.maps.Marker({
                    position: data[i].position,
                    icon: icons[data[i].type].icon,
                    map: map,
                });
                const contentString =
                    '<div id="infowindow">' +
                    '<div id="header">' +
                    '<h2>' + data[i].header + '</h2>' +
                    "</div>" +
                    '<div id="bodyContent">' +
                    '<img id="image" src=images/' + data[i].image + '></img>' +
                    '<p>' + data[i].text + '</p>' +
                    "</div>" +
                    "</div>";
                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    ariaLabel: "Referans",
                });


                markers.push(marker);
                infowindows.push(infowindow);
                marker.addListener("click", () => {
                    closeAllInfoWindows();
                    infowindow.open({
                        anchor: marker,
                        map,
                    });
                });
                addTableRow(data[i].header, data[i].text, i);
                map.panTo(marker.getPosition());
            }
        });

    function closeAllInfoWindows() {
        for (let i = 0; i < infowindows.length; i++) {
            infowindows[i].close();
        }
    }

    function addTableRow(header, text, index) {
        const tableRow = document.createElement("tr");
        const headerCell = document.createElement("td");
        const textCell = document.createElement("td");
        const buttonCell = document.createElement("td");
        const showMarkerButton = document.createElement("button");

        headerCell.innerHTML = header;
        textCell.innerHTML = text;

        showMarkerButton.innerHTML = "Show Marker Info";
        showMarkerButton.addEventListener("click", () => {
            closeAllInfoWindows();
            infowindows[index].open({
                anchor: markers[index],
                map,
            });
        });
        buttonCell.appendChild(showMarkerButton);

        tableRow.appendChild(headerCell);
        tableRow.appendChild(textCell);
        tableRow.appendChild(buttonCell);

        document.querySelector("#markersTable tbody").appendChild(tableRow);
    }
}

window.initMap = initMap;
