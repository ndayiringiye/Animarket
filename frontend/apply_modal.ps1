$path = "src\Pages\Dashboards\Admin\AdminDashboard.tsx"
$content = Get-Content $path -Raw
$content = $content -replace "`r`n", "`n"

function ApplyEdit([string]$old, [string]$new, [string]$label) {
    $script:content = $script:content -replace "`r`n", "`n"
    $oldN = $old -replace "`r`n", "`n"
    $newN = $new -replace "`r`n", "`n"
    if ($script:content.Contains($oldN)) {
        $script:content = $script:content.Replace($oldN, $newN)
        Write-Host "OK: $label" -ForegroundColor Green
    } else {
        Write-Host "FAILED (anchor not found): $label" -ForegroundColor Red
    }
}

ApplyEdit `
'@
// --- Main Layout ---
'@ `
'@
const AnimalDetailModal = ({
  animal,
  loading,
  error,
  onClose,
}: {
  animal: any | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {loading && (
        <div className="p-10 text-center text-sm text-slate-400">Loading animal profile...</div>
      )}
      {!loading && error && (
        <div className="p-10 text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={onClose} className="text-xs font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
            Close
          </button>
        </div>
      )}
      {!loading && !error && animal && (
        <>
          <div className="relative h-40 bg-gradient-to-br from-emerald-500 to-emerald-700 shrink-0">
            {animal.images && animal.images.length > 0 ? (
              <img
                src={animal.images[0]}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <Beef size={40} />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-5 pt-4 pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-800 truncate">{animal.name || 'Unnamed Animal'}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{animal.type || '-'} &middot; {animal.breed || '-'}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge variant={animal.isAvailable ? 'success' : 'warning'}>
                  {animal.isAvailable ? 'available' : 'listed'}
                </Badge>
                <Badge variant={animal.isVerified ? 'success' : 'warning'}>
                  {animal.isVerified ? 'verified' : animal.verificationLevel || 'unverified'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Gender</p>
                <p className="text-slate-700 font-medium capitalize truncate">{animal.gender || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Age</p>
                <p className="text-slate-700 font-medium truncate">{animal.age ?? '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Weight</p>
                <p className="text-slate-700 font-medium truncate">{animal.weight ?? '-'} kg</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Price</p>
                <p className="text-slate-700 font-medium truncate">{animal.price ?? '-'} {animal.currency || ''}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">District</p>
                <p className="text-slate-700 font-medium truncate">{animal.location?.district || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Village</p>
                <p className="text-slate-700 font-medium truncate">{animal.location?.village || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Health Status</p>
                <p className="text-slate-700 font-medium capitalize truncate">{animal.health?.healthStatus || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Vaccinated</p>
                <p className="text-slate-700 font-medium truncate">{animal.health?.vaccinated ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

// --- Main Layout ---
'@ `
"AnimalDetailModal component"

ApplyEdit `
'@
  const [animals, setAnimals] = useState<any[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(false);
  const [animalsError, setAnimalsError] = useState<string | null>(null);
'@ `
'@
  const [animals, setAnimals] = useState<any[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState(false);
  const [animalsError, setAnimalsError] = useState<string | null>(null);

  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [animalDetailLoading, setAnimalDetailLoading] = useState(false);
  const [animalDetailError, setAnimalDetailError] = useState<string | null>(null);
'@ `
"Animal detail modal state"

ApplyEdit `
'@
  const fetchAnimals = async () => {
    setAnimalsLoading(true);
    setAnimalsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(ANIMALS_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const allAnimals = Array.isArray(res.data)
        ? res.data
        : res.data.animals || res.data.data || [];
      setAnimals(allAnimals);
    } catch (err: any) {
      setAnimalsError(err?.response?.data?.message || 'Failed to load animals');
    } finally {
      setAnimalsLoading(false);
    }
  };
'@ `
'@
  const fetchAnimals = async () => {
    setAnimalsLoading(true);
    setAnimalsError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(ANIMALS_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const allAnimals = Array.isArray(res.data)
        ? res.data
        : res.data.animals || res.data.data || [];
      setAnimals(allAnimals);
    } catch (err: any) {
      setAnimalsError(err?.response?.data?.message || 'Failed to load animals');
    } finally {
      setAnimalsLoading(false);
    }
  };

  const viewAnimal = async (id: string) => {
    setShowAnimalModal(true);
    setAnimalDetailLoading(true);
    setAnimalDetailError(null);
    setSelectedAnimal(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/api/animal/animals/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSelectedAnimal(res.data?.data || res.data?.animal || res.data || null);
    } catch (err: any) {
      setAnimalDetailError(err?.response?.data?.message || 'Failed to load animal profile');
    } finally {
      setAnimalDetailLoading(false);
    }
  };
'@ `
"viewAnimal fetch function"

ApplyEdit `
'@
                          <td className="px-5 py-3.5">
                            <Badge variant={animal.isAvailable ? 'success' : 'warning'}>
                              {animal.isAvailable ? 'available' : 'listed'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                              View
                            </button>
                          </td>
'@ `
'@
                          <td className="px-5 py-3.5">
                            <Badge variant={animal.isAvailable ? 'success' : 'warning'}>
                              {animal.isAvailable ? 'available' : 'listed'}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => viewAnimal(animal._id)}
                              className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              View
                            </button>
                          </td>
'@ `
"View button onClick wiring"

ApplyEdit `
'@
      {showHotelModal && (
        <HotelDetailModal
          hotel={selectedHotel}
          loading={hotelDetailLoading}
          error={hotelDetailError}
          onClose={() => setShowHotelModal(false)}
        />
      )}
    </div>
  );
};
'@ `
'@
      {showHotelModal && (
        <HotelDetailModal
          hotel={selectedHotel}
          loading={hotelDetailLoading}
          error={hotelDetailError}
          onClose={() => setShowHotelModal(false)}
        />
      )}

      {showAnimalModal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          loading={animalDetailLoading}
          error={animalDetailError}
          onClose={() => setShowAnimalModal(false)}
        />
      )}
    </div>
  );
};
'@ `
"AnimalDetailModal render"

Set-Content -Path $path -Value $content -NoNewline
