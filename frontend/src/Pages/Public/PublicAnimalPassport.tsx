import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, MapPin, Syringe, Truck } from 'lucide-react';

const PUBLIC_PASSPORT_ENDPOINT = 'http://localhost:4000/api/passport/public';

interface PublicPassport {
  passportId: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: number;
  weight: number | null;
  photos: string[];
  location: { province: string; district: string; sector: string };
  health: {
    status: string;
    vaccinated: boolean;
    lastCheckupDate: string | null;
    vaccinations: { vaccineName: string; date: string; verifiedByVet: boolean }[];
  };
  verificationLevel: string;
  isVerified: boolean;
  delivery: { status: string; date: string | null } | null;
}

const label = (s: string) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

const HEALTH_DOT: Record<string, string> = {
  excellent: 'bg-emerald-500',
  good: 'bg-green-500',
  fair: 'bg-amber-500',
  poor: 'bg-red-500',
};

const PublicAnimalPassport = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [data, setData] = useState<PublicPassport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${PUBLIC_PASSPORT_ENDPOINT}/${animalId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Passport not found');
        setData(json.data);
      } catch (e: any) {
        setError(e.message || 'Passport not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [animalId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50 text-sm text-slate-500">Loading passport...</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 text-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Passport not found</h1>
          <p className="text-sm text-slate-500 mt-1">This QR code does not match a registered animal.</p>
        </div>
      </div>
    );
  }

  const loc = [data.location.sector, data.location.district, data.location.province].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-stone-50 py-6 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-200">Animal passport</p>
            <p className="font-mono text-lg tracking-wider">{data.passportId}</p>
          </div>
          {data.isVerified && (
            <span className="flex items-center gap-1 text-xs bg-emerald-800 px-2.5 py-1 rounded-full">
              <ShieldCheck size={14} /> {label(data.verificationLevel)}
            </span>
          )}
        </div>

        {data.photos.length > 0 && (
          <div>
            <img src={data.photos[photoIndex]} alt={data.name} className="w-full h-64 object-cover" />
            {data.photos.length > 1 && (
              <div className="flex gap-2 p-2 bg-stone-100">
                {data.photos.map((p, i) => (
                  <button key={p} onClick={() => setPhotoIndex(i)} aria-label={`Photo ${i + 1}`}>
                    <img
                      src={p}
                      alt=""
                      className={`w-14 h-14 object-cover rounded-md border-2 ${i === photoIndex ? 'border-emerald-700' : 'border-transparent'}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-5 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{data.name}</h1>
            <p className="text-sm text-slate-500">
              {label(data.type)}, {data.breed}
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Sex</dt>
              <dd className="font-medium text-slate-800">{label(data.gender)}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Age</dt>
              <dd className="font-medium text-slate-800">{data.age}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Weight</dt>
              <dd className="font-medium text-slate-800">{data.weight ? `${data.weight} kg` : '-'}</dd>
            </div>
          </dl>

          {loc && (
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400 shrink-0" /> {loc}
            </p>
          )}

          <section className="border-t border-stone-200 pt-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Syringe size={16} className="text-slate-400" /> Health
            </h2>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <span className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[data.health.status] || 'bg-slate-400'}`} />
              {label(data.health.status)} condition - Last checkup {fmtDate(data.health.lastCheckupDate)}
            </p>
            <p className="text-sm text-slate-600">
              {data.health.vaccinated ? 'Vaccinated' : 'No vaccination recorded'}
            </p>
            {data.health.vaccinations.length > 0 && (
              <ul className="text-sm divide-y divide-stone-100 border border-stone-200 rounded-lg">
                {data.health.vaccinations.map((v, i) => (
                  <li key={i} className="flex justify-between px-3 py-2">
                    <span className="text-slate-700">
                      {v.vaccineName}
                      {v.verifiedByVet && <span className="ml-2 text-xs text-emerald-700">Vet verified</span>}
                    </span>
                    <span className="text-slate-400">{fmtDate(v.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {data.delivery && (
            <section className="border-t border-stone-200 pt-4 space-y-1">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Truck size={16} className="text-slate-400" /> Delivery
              </h2>
              <p className="text-sm text-slate-700">
                {label(data.delivery.status)}
                {data.delivery.date ? ` - ${fmtDate(data.delivery.date)}` : ''}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicAnimalPassport;