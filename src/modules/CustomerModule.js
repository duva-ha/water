// Nhập kết nối database từ file cấu hình đã tách
import { db } from "../firebase.js"; 
// Nhập các hàm Firestore trực tiếp từ CDN để đảm bảo tính tương thích trên web
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const { useState, useEffect } = React;

export const CustomerModule = () => {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: '', phone: '' });

    // 1. Tự động cập nhật danh sách khách hàng từ Firebase
    useEffect(() => {
        const q = query(collection(db, "customers"), orderBy("name", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCustomers(data);
        });
        return () => unsubscribe();
    }, []);

    // 2. Logic Lưu khách hàng mới với chữ in hoa
    const handleSave = async () => {
        if (!form.name || !form.phone) {
            alert("VUI LÒNG NHẬP ĐỦ TÊN VÀ SĐT!");
            return;
        }
        try {
            await addDoc(collection(db, "customers"), {
                name: form.name.toUpperCase(), // Viết hoa tên khách hàng
                phone: form.phone,
                createdAt: new Date()
            });
            setForm({ name: '', phone: '' }); // Xóa form sau khi lưu thành công
        } catch (error) {
            console.error("Lỗi khi lưu khách hàng:", error);
        }
    };

    // 3. Logic Xóa khách hàng
    const handleDelete = async (id) => {
        if (window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA?")) {
            await deleteDoc(doc(db, "customers", id));
        }
    };

    return (
        <div className="fade-in w-full max-w-[1400px] mx-auto p-4 md:p-8">
            <h1 className="text-5xl md:text-8xl font-black mb-16 italic border-b-[15px] border-[#ccff00] inline-block tracking-tighter uppercase">
                Khách Hàng /
            </h1>
            
            {/* KHU VỰC NHẬP LIỆU: HUGE INPUT & NÚT LƯU CÙNG HÀNG */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-20 items-end">
                <div className="xl:col-span-5">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 ml-2 italic block">Họ Tên Khách Hàng</label>
                    <input 
                        className="h-[80px] text-2xl md:text-3xl font-black uppercase rounded-2xl border-[5px] border-black px-6 w-full outline-none focus:ring-8 focus:ring-yellow-400 transition-all bg-white" 
                        placeholder="VÍ DỤ: NGUYỄN VĂN A" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                    />
                </div>
                <div className="xl:col-span-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-2 ml-2 italic block">Số Điện Thoại</label>
                    <input 
                        className="h-[80px] text-2xl md:text-3xl font-black uppercase rounded-2xl border-[5px] border-black px-6 w-full outline-none focus:ring-8 focus:ring-yellow-400 transition-all bg-white" 
                        placeholder="090..." 
                        type="tel" 
                        value={form.phone} 
                        onChange={e => setForm({...form, phone: e.target.value})} 
                    />
                </div>
                <div className="xl:col-span-3">
                    <button 
                        onClick={handleSave} 
                        className="h-[80px] w-full bg-black text-[#ccff00] rounded-2xl font-black text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:scale-95 transition-all border-none"
                    >
                        LƯU KHÁCH +
                    </button>
                </div>
            </div>

            {/* DANH SÁCH KHÁCH HÀNG DẠNG THẺ (CARD-BASED) */}
            <div className="space-y-6">
                <div className="hidden md:grid grid-cols-12 px-10 mb-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                    <div className="col-span-7">Tên Khách Hàng</div>
                    <div className="col-span-5 text-right">Liên hệ / Hành động</div>
                </div>
                
                {customers.map((c) => (
                    <div key={c.id} className="bg-white border-[6px] border-black p-8 rounded-[3rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-12 items-center gap-6 transition-transform hover:scale-[1.01]">
                        <div className="md:col-span-7">
                            <p className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter italic">{c.name}</p>
                        </div>
                        <div className="md:col-span-5 flex justify-between items-center border-t-2 md:border-t-0 border-zinc-100 pt-4 md:pt-0">
                            <p className="text-3xl md:text-5xl font-bold text-zinc-400 tracking-tighter italic">{c.phone}</p>
                            <button 
                                onClick={() => handleDelete(c.id)} 
                                className="bg-red-50 text-red-500 px-6 py-2 rounded-2xl font-black text-sm border-2 border-red-100 uppercase hover:bg-red-500 hover:text-white transition-colors"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
