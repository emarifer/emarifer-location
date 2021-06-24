
const $form = document.querySelector('.uploader-form');
const $response = document.querySelector('.response');
const $button = document.querySelector('button');
let track;

const Spain_MapasrasterIGN = L.tileLayer.wms('http://www.ign.es/wms-inspire/mapa-raster', {
    layers: 'mtn_rasterizado',
    format: 'image/png',
    transparent: false,
    continuousWorld: true,
    attribution: '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a> contributors'
});

const Spain_PNOA_Ortoimagen = L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
    layers: 'OI.OrthoimageCoverage',
    format: 'image/png',
    transparent: false,
    continuousWorld: true,
    attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a> contributors'
});

const baseMaps = {
    "Spain_MapasrasterIGN": Spain_MapasrasterIGN,
    "Spain_PNOA_Ortoimagen": Spain_PNOA_Ortoimagen
};

const map = L.map('map', {
    layers: [
        Spain_MapasrasterIGN,
    ]
}).fitBounds([[24.9300000311, -19.6], [46.0700000311, 5.6]]);;
L.control.layers(baseMaps).addTo(map);
L.control.scale({ options: { position: 'bottomleft', metric: true } }).addTo(map);

function displayTrack() {
    if (track) map.removeLayer(track);

    track = new L.GPX('tracks/track.gpx', {
        async: true,
        marker_options: {
            wptIconUrls: {
                '': 'icons/pin-icon-wpt.png',
            },
            startIconUrl: 'icons/pin-icon-start.png',
            endIconUrl: 'icons/pin-icon-end.png',
            shadowUrl: 'icons/pin-shadow.png'
        }
    }).on('loaded', (e) => {
        map.fitBounds(e.target.getBounds());
    }).addTo(map);
};

function removeResponse() {
    setTimeout(() => {
        $response.classList.add('none');
    }, 3000);
}

function initializeLocator() {

    map.locate({
        // setView: true,
        // maxZoom: 16,
        watch: true,
        timeout: 5000
    });

    let marker;
    let circles;

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        if (map.hasLayer(circles) && map.hasLayer(marker)) {
            map.removeLayer(circles);
            map.removeLayer(marker);
        }
        marker = new L.Marker(e.latlng, { draggable: true });
        circles = new L.circle(e.latlng, radius);
        circles
            .bindPopup(`You are less than ${radius} meters from this point`)
            .openPopup();
        map.addLayer(marker);
        map.addLayer(circles);
    }
    map.on('locationfound', onLocationFound);
}

document.addEventListener('submit', e => {
    e.preventDefault();

    fetch('https://emarifer-location.herokuapp.com/upload', { // http://localhost:3000/upload
        method: 'POST',
        body: new FormData(e.target) // FormData parsea los elementos del formulario
    })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
            $response.classList.remove('none');
            $response.textContent = json.message; // `<p>${json.message}</p>`;
            $form.reset();
            displayTrack();
            removeResponse();
        });
});

$button.addEventListener('click', e => initializeLocator());

/**
  * PANORÁMICA Y ZOOM DESACTIVADOS CON LA OPCIÓN DE LOCALIZACIÓN 'WATCH: TRUE'. VER:
  * https://github.com/Leaflet/Leaflet/issues/5128
  */
