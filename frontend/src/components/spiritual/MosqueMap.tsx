import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Mosque } from '../../lib/MosqueService';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// User Location Icon
const userIcon = L.divIcon({
    className: 'custom-user-icon',
    html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Mosque Icon
const mosqueIcon = L.divIcon({
    className: 'custom-mosque-icon',
    html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

interface MosqueMapProps {
    userLat: number;
    userLon: number;
    mosques: Mosque[];
    selectedMosqueId?: number | null;
    onSelectMosque: (mosque: Mosque) => void;
}

export function MosqueMap({ userLat, userLon, mosques, selectedMosqueId, onSelectMosque }: MosqueMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const userMarkerRef = useRef<L.Marker | null>(null);

    // 1. Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // If map already exists, just return (React 18 double-mount protection)
        if (mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView([userLat, userLon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapRef.current = map;

        // Container her boyutlandığında harita parçalanmasını önlemek için Leaflet'e yenilenme emri ver.
        const resizeObserver = new ResizeObserver(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        });
        resizeObserver.observe(mapContainerRef.current);

        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Run once on mount (or rely on ref to prevent double init)

    // 2. Update Map Center & User Marker when user location changes
    useEffect(() => {
        if (!mapRef.current) return;

        // Update User Marker
        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([userLat, userLon]);
        } else {
            userMarkerRef.current = L.marker([userLat, userLon], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("Sizin Konumunuz");
        }

        // Only pan if no mosque is selected
        if (!selectedMosqueId) {
            mapRef.current.setView([userLat, userLon], 15);
        }

    }, [userLat, userLon, selectedMosqueId]); // selectedMosqueId dependency handled below

    // 3. Update Markers & FlyTo Selected
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add Mosque Markers
        mosques.forEach(mosque => {
            const marker = L.marker([mosque.lat, mosque.lon], { icon: mosqueIcon })
                .addTo(mapRef.current!)
                .on('click', () => onSelectMosque(mosque));

            // Build Popup Content
            const popupContent = document.createElement('div');
            popupContent.className = "flex flex-col min-w-[200px] w-full max-w-[280px] p-0.5";
            popupContent.innerHTML = `
                <!-- Header -->
                <div class="flex items-start gap-3 mb-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20 flex flex-col items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white mb-0.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
                    </div>
                    <div class="flex-1 min-w-0 pt-0.5">
                        <h3 class="font-black text-[15px] !text-slate-900 dark:!text-white leading-tight break-words pr-2 tracking-tight" style="font-family: 'Inter', sans-serif !important;">
                            ${mosque.name || "Bilinmeyen Cami"}
                        </h3>
                        <div class="flex items-center gap-1.5 mt-1.5">
                             <span class="flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 dark:bg-white/10">
                                 <svg class="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                             </span>
                             <span class="text-[11px] font-black !text-emerald-700 dark:!text-emerald-400 tracking-wider" style="font-family: 'Inter', sans-serif !important;">
                                ${(mosque.distance || 0).toFixed(0)}m Uzaklıkta
                             </span>
                        </div>
                    </div>
                </div>
                
                <!-- Body: Address if available -->
                ${mosque.address ? `
                <div class="bg-slate-50 dark:bg-[#141f35]/50 border border-slate-100 dark:border-white/[0.05] rounded-xl p-2.5 mb-3 flex items-start gap-2">
                     <svg class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                     <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">${mosque.address}</p>
                </div>
                ` : '<div class="h-2"></div>'}
                
                <!-- Actions -->
                <a href="https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}" 
                   target="_blank" 
                   class="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 dark:bg-emerald-600 !text-white rounded-xl shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95" 
                   style="text-decoration: none; font-family: 'Inter', sans-serif; color: #ffffff !important;">
                    
                    <!-- Button Glow -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>

                    <svg class="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"/></svg>
                    <span class="text-[13px] font-black tracking-wide relative z-10 !text-white" style="color: #ffffff !important;">Yol Tarifi Çiz</span>
                </a>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 320,
                minWidth: 220,
                className: 'custom-leaflet-popup shadow-2xl rounded-2xl overflow-hidden border-0'
            });
            markersRef.current.push(marker);

            // If this is the selected mosque, open popup and fly to it
            if (selectedMosqueId === mosque.id) {
                marker.openPopup();
                mapRef.current!.flyTo([mosque.lat, mosque.lon], 16, { animate: true });
            }
        });

    }, [mosques, selectedMosqueId, onSelectMosque, userLat, userLon]); // Re-run when mosques or selection changes

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full rounded-xl z-0"
            style={{ minHeight: '300px' }}
        />
    );
}
