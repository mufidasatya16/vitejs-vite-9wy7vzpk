import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  Send,
  Star,
  ShieldCheck,
  Vote,
  MessageSquare,
  Trash2,
  Share2,
  Palette,
  Settings,
  Plus,
  X,
  Upload,
  Copy,
  Check,
  Download,
  Sparkles,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import html2canvas from 'html2canvas';

const THEMES = [
  {
    id: 'soft-pink',
    name: 'Soft Pink',
    bg: 'from-pink-100 via-rose-100 to-pink-200',
    card: 'bg-white/80',
    accent: 'bg-pink-500 hover:bg-pink-600',
    text: 'text-pink-600',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'soft-lilac',
    name: 'Soft Lilac',
    bg: 'from-purple-100 via-fuchsia-100 to-indigo-100',
    card: 'bg-white/80',
    accent: 'bg-purple-500 hover:bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'peach',
    name: 'Peach Soft',
    bg: 'from-orange-100 via-amber-100 to-rose-100',
    card: 'bg-white/80',
    accent: 'bg-orange-500 hover:bg-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'mint',
    name: 'Mint Green',
    bg: 'from-emerald-100 via-teal-100 to-green-100',
    card: 'bg-white/80',
    accent: 'bg-emerald-500 hover:bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'baby-blue',
    name: 'Baby Blue',
    bg: 'from-sky-100 via-blue-100 to-indigo-100',
    card: 'bg-white/80',
    accent: 'bg-sky-500 hover:bg-sky-600',
    text: 'text-sky-600',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Cream',
    bg: 'from-yellow-50 via-amber-50 to-orange-100',
    card: 'bg-white/85',
    accent: 'bg-amber-500 hover:bg-amber-600',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'bright-pink',
    name: 'Pink Cerah',
    bg: 'from-pink-400 via-rose-400 to-fuchsia-500',
    card: 'bg-white/90',
    accent: 'bg-rose-600 hover:bg-rose-700',
    text: 'text-rose-600',
    border: 'border-rose-300',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'dark',
    name: 'Elegan Gelap',
    bg: 'from-slate-900 via-gray-900 to-zinc-900',
    card: 'bg-white/95',
    accent: 'bg-slate-800 hover:bg-slate-900',
    text: 'text-slate-800',
    border: 'border-slate-300',
    badge: 'bg-slate-200 text-slate-800',
  },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Waduh, kurang banget nih (1/5)',
  2: 'Perlu banyak perbaikan ya (2/5)',
  3: 'Lumayan lah, standar (3/5)',
  4: 'Enak banget! Suka deh (4/5)',
  5: 'Mantap banget! Bintang lima! (5/5)',
};

export default function App() {
  // State Data Toko
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('toko_profile');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Kedai Manis Kita',
          bio: 'Kirim kritik, saran jujur, atau ikut vote menu baru selanjutnya! 100% rahasia & tanpa nama.',
          avatar: '',
        };
  });

  const [menus, setMenus] = useState(() => {
    const saved = localStorage.getItem('toko_menus');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: 'Matcha Lava Croissant',
            desc: 'Croissant renyah dengan isian matcha lumer',
            votes: 12,
            image: '',
          },
          {
            id: 2,
            name: 'Strawberry Cloud Milk',
            desc: 'Susu segar dengan krim stroberi lembut',
            votes: 8,
            image: '',
          },
        ];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('toko_messages');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 101,
            text: 'Minumannya seger banget kak, tapi es batunya dikit aja biar makin kerasa manisnya!',
            rating: 5,
            date: 'Hari ini, 14:20',
          },
        ];
  });

  const [themeId, setThemeId] = useState(
    () => localStorage.getItem('toko_theme') || 'soft-pink'
  );
  const [adminPin, setAdminPin] = useState(
    () => localStorage.getItem('toko_pin') || '123456'
  );

  // State Navigasi & Interaksi Publik
  const [publicTab, setPublicTab] = useState<'kritik' | 'vote'>('kritik');
  const [rating, setRating] = useState<number>(5);
  const [messageInput, setMessageInput] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [votedIds, setVotedIds] = useState<number[]>([]);

  // State Admin & Modal
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [adminTab, setAdminTab] = useState<
    'pesan' | 'menu' | 'profil' | 'tema' | 'share' | 'setting'
  >('pesan');

  // State Form Admin
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDesc, setNewMenuDesc] = useState('');
  const [newMenuImg, setNewMenuImg] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // State Story Modal
  const [storyMsg, setStoryMsg] = useState<any>(null);
  const [storyReply, setStoryReply] = useState(
    'Makasih banyak kak! Ditunggu orderan selanjutnya ya ❤️'
  );
  const [storyThemeId, setStoryThemeId] = useState(themeId);
  const storyCardRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const storyTheme = THEMES.find((t) => t.id === storyThemeId) || currentTheme;

  // Simpan Otomatis ke LocalStorage
  useEffect(() => {
    localStorage.setItem('toko_profile', JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem('toko_menus', JSON.stringify(menus));
  }, [menus]);
  useEffect(() => {
    localStorage.setItem('toko_messages', JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    localStorage.setItem('toko_theme', themeId);
    setStoryThemeId(themeId);
  }, [themeId]);
  useEffect(() => {
    localStorage.setItem('toko_pin', adminPin);
  }, [adminPin]);

  // Hitung Rata-rata Rating
  const avgRating =
    messages.length > 0
      ? (
          messages.reduce((acc: number, m: any) => acc + (m.rating || 5), 0) /
          messages.length
        ).toFixed(1)
      : '0.0';

  // Handler Upload File Gambar ke Base64
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (res: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Kirim Pesan Anonim
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const now = new Date();
    const timeStr = `Hari ini, ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages([
      { id: Date.now(), text: messageInput.trim(), rating, date: timeStr },
      ...messages,
    ]);
    setMessageInput('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  // Vote Menu
  const handleVote = (id: number) => {
    if (votedIds.includes(id)) return;
    setMenus(
      menus.map((m: any) => (m.id === id ? { ...m, votes: m.votes + 1 } : m))
    );
    setVotedIds([...votedIds, id]);
  };

  // Login Admin
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Tambah Menu Baru
  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    setMenus([
      ...menus,
      {
        id: Date.now(),
        name: newMenuName,
        desc: newMenuDesc,
        votes: 0,
        image: newMenuImg,
      },
    ]);
    setNewMenuName('');
    setNewMenuDesc('');
    setNewMenuImg('');
  };

  // Download Kartu Story
  const handleDownloadStory = async () => {
    if (!storyCardRef.current) return;
    const canvas = await html2canvas(storyCardRef.current, {
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `story-ulasan-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : 'https://toko-kita.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} transition-colors duration-500 py-8 px-4 font-sans text-gray-800`}
    >
      <div className="max-w-md mx-auto">
        {/* TAMPILAN PEMBELI / PENONTON */}
        {!isAdmin ? (
          <div
            className={`${currentTheme.card} backdrop-blur-md rounded-3xl shadow-xl p-6 border ${currentTheme.border}`}
          >
            {/* Profil Toko */}
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-3 flex items-center justify-center ${currentTheme.badge}`}
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sparkles className="w-10 h-10 opacity-70" />
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {profile.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Tab Pemisah: Kritik & Saran vs Vote Menu */}
            <div className="grid grid-cols-2 gap-2 bg-gray-100/80 p-1.5 rounded-2xl mb-6">
              <button
                onClick={() => setPublicTab('kritik')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  publicTab === 'kritik'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare
                  className={`w-4 h-4 ${
                    publicTab === 'kritik' ? currentTheme.text : ''
                  }`}
                />
                Kritik & Saran
              </button>
              <button
                onClick={() => setPublicTab('vote')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  publicTab === 'vote'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Vote
                  className={`w-4 h-4 ${
                    publicTab === 'vote' ? currentTheme.text : ''
                  }`}
                />
                Vote Menu Baru
              </button>
            </div>

            {/* KONTEN TAB 1: KRITIK & SARAN ANONIM */}
            {publicTab === 'kritik' && (
              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Rating Bintang */}
                <div className="bg-white/70 rounded-2xl p-4 text-center border border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Kasih Bintang Buat Jualan Kami
                  </p>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${currentTheme.text}`}>
                    {RATING_LABELS[rating]}
                  </p>
                </div>

                {/* Kotak Pesan Rahasia */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                    PESAN ANONIM KAMU
                  </label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Tulis kritik, saran, atau pujian jujur di sini... Admin tidak akan tahu siapa pengirimnya!"
                    className="w-full rounded-2xl border border-gray-200 bg-white/90 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                    required
                  />
                </div>

                {/* Tombol Kirim */}
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${currentTheme.accent}`}
                >
                  <Send className="w-4 h-4" />
                  {sentSuccess
                    ? 'Terkirim Secara Rahasia! 🎉'
                    : 'Kirim Pesan Rahasia'}
                </button>

                {/* Peringatan Privasi 100% Anonim */}
                <div className="flex items-start gap-2.5 bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3 text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    <strong>100% Anonim & Aman:</strong> Sistem tidak mencatat
                    nama, akun, nomor HP, maupun lokasi. Nama penulis{' '}
                    <strong>tidak akan terlihat</strong> di halaman Admin.
                  </p>
                </div>
              </form>
            )}

            {/* KONTEN TAB 2: VOTING MENU SELANJUTNYA */}
            {publicTab === 'vote' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 text-center mb-2">
                  Pilih menu yang paling kamu pengen ada di jualan berikutnya!
                </p>
                {menus.map((menu: any) => {
                  const totalVotes = menus.reduce(
                    (sum: number, m: any) => sum + m.votes,
                    0
                  );
                  const percent =
                    totalVotes > 0
                      ? Math.round((menu.votes / totalVotes) * 100)
                      : 0;
                  const hasVoted = votedIds.includes(menu.id);

                  return (
                    <div
                      key={menu.id}
                      className="bg-white/90 rounded-2xl p-3.5 border border-gray-100 shadow-sm"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {menu.image ? (
                            <img
                              src={menu.image}
                              alt={menu.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-gray-900 truncate">
                            {menu.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {menu.desc}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${currentTheme.accent} transition-all duration-500`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-600">
                              {percent}%
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleVote(menu.id)}
                          disabled={hasVoted}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            hasVoted
                              ? 'bg-gray-100 text-gray-400 cursor-default'
                              : `${currentTheme.accent} text-white shadow-sm active:scale-95`
                          }`}
                        >
                          {hasVoted ? 'Voted ✓' : 'Vote'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tombol Gembok Rahasia Masuk Admin */}
            <div className="mt-8 pt-4 border-t border-gray-200/60 flex justify-between items-center text-xs text-gray-400">
              <span>Ruang Suara Pembeli • 100% Anonim</span>
              <button
                onClick={() => setShowPinModal(true)}
                className="p-2 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
                title="Masuk Dashboard Admin"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* DASHBOARD ADMIN */
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="font-extrabold text-lg text-gray-900">
                  Dashboard Admin
                </h2>
                <p className="text-xs text-gray-500">
                  Kelola pesan, menu, tema & link toko
                </p>
              </div>
              <button
                onClick={() => setIsAdmin(false)}
                className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl"
              >
                <Unlock className="w-3.5 h-3.5" /> Tutup Admin
              </button>
            </div>

            {/* Menu Navigasi Admin */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
              {[
                { id: 'pesan', label: 'Pesan', icon: MessageSquare },
                { id: 'menu', label: 'Menu', icon: Vote },
                { id: 'profil', label: 'Profil', icon: Camera },
                { id: 'tema', label: 'Tema', icon: Palette },
                { id: 'share', label: 'Bagikan', icon: Share2 },
                { id: 'setting', label: 'PIN', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      adminTab === tab.id
                        ? `${currentTheme.accent} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ADMIN TAB 1: PESAN MASUK & RATA-RATA RATING */}
            {adminTab === 'pesan' && (
              <div className="space-y-3">
                {/* Ringkasan Rata-rata Rating */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-800">
                      RATA-RATA RATING TOKO
                    </p>
                    <p className="text-xs text-amber-600">
                      Dari total {messages.length} ulasan masuk
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-amber-100">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-base text-gray-900">
                      {avgRating}
                    </span>
                    <span className="text-xs text-gray-400">/ 5</span>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 py-8">
                    Belum ada pesan rahasia yang masuk.
                  </p>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${currentTheme.badge}`}
                        >
                          Pesan Pembeli
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= msg.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {msg.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">
                        "{msg.text}"
                      </p>
                      <div className="flex justify-between items-center pt-1">
                        <button
                          onClick={() =>
                            setMessages(
                              messages.filter((m: any) => m.id !== msg.id)
                            )
                          }
                          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 px-2 py-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                        <button
                          onClick={() => {
                            setStoryMsg(msg);
                            setStoryThemeId(themeId);
                          }}
                          className={`flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-full shadow-sm ${currentTheme.accent}`}
                        >
                          <Share2 className="w-3.5 h-3.5" /> Balas di Story
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ADMIN TAB 2: KELOLA MENU VOTE */}
            {adminTab === 'menu' && (
              <div className="space-y-4">
                <form
                  onSubmit={handleAddMenu}
                  className="bg-gray-50 p-3.5 rounded-2xl space-y-2.5 border border-gray-100"
                >
                  <p className="text-xs font-bold text-gray-700">
                    Tambah Pilihan Menu Baru
                  </p>
                  <input
                    type="text"
                    placeholder="Nama menu (contoh: Es Kopi Susu Gula Aren)"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi singkat..."
                    value={newMenuDesc}
                    onChange={(e) => setNewMenuDesc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-white border border-dashed border-gray-300 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      {newMenuImg ? 'Foto Terpilih ✓' : 'Upload Foto Menu'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setNewMenuImg)}
                      />
                    </label>
                    {newMenuImg && (
                      <button
                        type="button"
                        onClick={() => setNewMenuImg('')}
                        className="p-2 text-red-500 bg-red-50 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 ${currentTheme.accent}`}
                  >
                    <Plus className="w-4 h-4" /> Tambah ke Daftar Vote
                  </button>
                </form>

                <div className="space-y-2">
                  {menus.map((m: any) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        {m.image && (
                          <img
                            src={m.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-800">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {m.votes} suara
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setMenus(
                            menus.filter((item: any) => item.id !== m.id)
                          )
                        }
                        className="text-red-400 hover:text-red-600 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN TAB 3: EDIT PROFIL TOKO */}
            {adminTab === 'profil' && (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <label className="text-xs font-bold text-pink-600 cursor-pointer bg-pink-50 px-3 py-1.5 rounded-full">
                    Ganti Foto Profil
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (res) =>
                          setProfile({ ...profile, avatar: res })
                        )
                      }
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Nama Toko
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full text-sm p-2.5 rounded-xl border border-gray-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600">
                    Bio / Deskripsi Singkat
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="w-full text-sm p-2.5 rounded-xl border border-gray-200 mt-1"
                  />
                </div>
              </div>
            )}

            {/* ADMIN TAB 4: PILIH TEMA WARNA SOFT */}
            {adminTab === 'tema' && (
              <div className="grid grid-cols-2 gap-2.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      themeId === t.id
                        ? 'border-gray-900 ring-2 ring-gray-900/10 bg-gray-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.bg} border border-black/10 shrink-0`}
                    />
                    <span className="text-xs font-bold text-gray-800">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ADMIN TAB 5: BAGIKAN LINK & BARCODE */}
            {adminTab === 'share' && (
              <div className="text-center space-y-4 py-2">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 inline-block shadow-sm">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Toko"
                    className="w-44 h-44 mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 px-4">
                  Scan barcode di atas atau salin link di bawah untuk dibagikan
                  ke bio media sosialmu!
                </p>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-xs text-gray-600 flex-1 outline-none px-2"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1 ${currentTheme.accent}`}
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedLink ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>
            )}

            {/* ADMIN TAB 6: GANTI PIN */}
            {adminTab === 'setting' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">
                  Ubah PIN rahasia untuk masuk ke Dashboard Admin.
                </p>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Masukkan PIN baru (angka)"
                  value={newPinInput}
                  onChange={(e) =>
                    setNewPinInput(e.target.value.replace(/\D/g, ''))
                  }
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 tracking-widest font-bold text-center"
                />
                <button
                  onClick={() => {
                    if (newPinInput.length >= 4) {
                      setAdminPin(newPinInput);
                      setNewPinInput('');
                      alert('PIN baru berhasil disimpan!');
                    } else {
                      alert('PIN minimal 4 angka ya!');
                    }
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold text-white ${currentTheme.accent}`}
                >
                  Simpan PIN Baru
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL INPUT PIN ADMIN */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Masukkan PIN Admin</h3>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError(false);
                  }}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePinSubmit} className="space-y-3">
                <input
                  type="password"
                  placeholder="••••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center text-xl tracking-widest p-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-pink-400"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-500 text-center font-semibold">
                    PIN salah! Coba lagi (default: 123456)
                  </p>
                )}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-2xl text-white font-bold text-sm ${currentTheme.accent}`}
                >
                  Buka Dashboard
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL KARTU UPLOAD STORY UNIVERSAL */}
        {storyMsg && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold tracking-wider text-gray-500 uppercase">
                  Kartu Upload Story
                </span>
                <button
                  onClick={() => setStoryMsg(null)}
                  className="p-1 bg-gray-100 rounded-full text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pilihan Warna Kartu (Menyesuaikan Tema Web) */}
              <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl">
                <span className="text-xs font-bold text-gray-600">
                  Warna Kartu:
                </span>
                <div className="flex gap-1.5">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setStoryThemeId(t.id)}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                        t.bg
                      } border ${
                        storyThemeId === t.id
                          ? 'ring-2 ring-gray-800 scale-110'
                          : 'border-black/10'
                      }`}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>

              {/* Area Kartu yang Akan Didownload */}
              <div
                ref={storyCardRef}
                className={`p-5 rounded-3xl bg-gradient-to-br ${storyTheme.bg} shadow-inner space-y-3`}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <div className="bg-gray-900 text-white text-center py-2.5 px-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">
                      {profile.name}
                    </p>
                    <p className="text-xs font-extrabold">
                      Pesan Anonim dari Pembeli ✨
                    </p>
                  </div>
                  <div className="p-4 text-center space-y-2">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= storyMsg.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      "{storyMsg.text}"
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${storyTheme.badge}`}
                    >
                      100% Anonim
                    </span>
                  </div>
                </div>

                {/* Kotak Balasan Admin */}
                <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-3.5 border border-white/60">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
                    Balasan Kami:
                  </p>
                  <textarea
                    rows={2}
                    value={storyReply}
                    onChange={(e) => setStoryReply(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-gray-900 focus:outline-none resize-none"
                  />
                </div>

                <div className="text-center">
                  <span className="inline-block bg-black/70 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                    Kirim kritik & saran anonim di link bio!
                  </span>
                </div>
              </div>

              {/* Tombol Download Gambar */}
              <button
                onClick={handleDownloadStory}
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 ${storyTheme.accent}`}
              >
                <Download className="w-4 h-4" /> Download Gambar Kartu Story
                (PNG)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
