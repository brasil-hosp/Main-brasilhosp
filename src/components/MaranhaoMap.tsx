import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

// Fix para os ícones do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MaranhaoMap = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cities = [
    { name: 'São Luís', coords: [-2.5387, -44.3028] as [number, number] },
    { name: 'Imperatriz', coords: [-5.5264, -47.4914] as [number, number] },
    { name: 'Caxias', coords: [-4.8586, -43.3558] as [number, number] },
    { name: 'Timon', coords: [-5.0944, -42.8366] as [number, number] },
    { name: 'Açailândia', coords: [-4.9475, -47.5006] as [number, number] }
  ];

  useEffect(() => {
    // Buscar dados GeoJSON do Maranhão do IBGE
    fetch('https://servicodados.ibge.gov.br/api/v3/malhas/estados/21?formato=application/vnd.geo+json&qualidade=maxima')
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar mapa:', error);
        toast.error('Erro ao carregar o mapa do Maranhão');
        setLoading(false);
      });
  }, []);

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  const geoJsonStyle = {
    color: 'hsl(var(--primary))',
    weight: 2,
    fillColor: 'hsl(var(--primary))',
    fillOpacity: 0.15
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] rounded-xl shadow-lg bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando mapa do Maranhão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[-4.9609, -45.2744]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {geoData && (
          <GeoJSON 
            data={geoData} 
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {cities.map((city, index) => (
          <Marker key={index} position={city.coords}>
            <Popup>
              <div className="text-center">
                <strong>{city.name}</strong>
                <br />
                <span className="text-sm text-muted-foreground">Maranhão</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MaranhaoMap;
