import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const DeliveryApp = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy dữ liệu Real-time từ Firestore, sắp xếp theo thời gian mới nhất
  useEffect(() => {
    const q = query(collection(db, "deliveries"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Hàm xử lý khi hoàn thành đơn hàng
  const handleComplete = async (id, currentShells) => {
    if (!currentShells && currentShells !== 0) {
      alert("Vui lòng nhập số vỏ bình thu hồi!");
      return;
    }

    try {
      const docRef = doc(db, "deliveries", id);
      await updateDoc(docRef, {
        status: 'completed',
        emptyShellsReturned: Number(currentShells),
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans text-slate-900">
      {/* Header tối giản */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Giviso Water
          </h1>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hệ thống giao hàng</p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold">
          {deliveries.filter(d => d.status !== 'completed').length} Đơn chờ
        </div>
      </header>

      <main className="p-4 space-y-4">
        {deliveries.length === 0 && (
          <div className="text-center py-20 text-slate-400">Không có đơn hàng nào hôm nay.</div>
        )}

        {deliveries.map((item) => (
          <div 
            key={item.id} 
            className={`transition-all duration-300 bg-white rounded-2xl p-5 shadow-sm border ${
              item.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : 'border-slate-100 ring-1 ring-slate-100'
            }`}
          >
            {/* Trạng thái & Khách hàng */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg leading-tight text-slate-800">{item.customerName}</h3>
              <span className={`shrink-0 ml-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                item.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'
              }`}>
                {item.status === 'completed' ? 'Hoàn thành' : 'Chờ giao'}
              </span>
            </div>

            {/* Địa chỉ */}
            <p className="text-slate-500 text-sm mb-4 flex items-start gap-1">
              <span className="mt-0.5 text-blue-500">📍</span> {item.address}
            </p>

            {/* Chi tiết số lượng & Liên hệ */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-50 my-4">
              <div className="text-sm">
                <span className="block text-slate-400 text-[11px] uppercase font-bold">Số lượng giao</span>
                <strong className="text-lg text-blue-700">{item.quantity}</strong> <span className="text-xs text-slate-500 font-medium">bình</span>
              </div>
              <div className="text-right">
                <a 
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-bold active:bg-green-100 transition-colors"
                >
                  📞 Gọi khách
                </a>
              </div>
            </div>

            {/* Thao tác cho Shipper */}
            {item.status !== 'completed' ? (
              <div className="space-y-3">
                <div className="relative group">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase">
                    Vỏ bình thu về
                  </label>
                  <input 
                    type="number" 
                    placeholder="Nhập số lượng vỏ..."
                    id={`shells-${item.id}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button 
                  onClick={() => handleComplete(item.id, document.getElementById(`shells-${item.id}`).value)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                >
                  Xác nhận hoàn thành 🏁
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 italic flex justify-between uppercase font-bold tracking-tight">
                <span>Vỏ đã thu: {item.emptyShellsReturned || 0}</span>
                <span>{item.completedAt?.toDate().toLocaleTimeString('vi-VN')}</span>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default DeliveryApp;
