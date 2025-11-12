import React from 'react';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="text-white" size={40} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          SwiftChat ga Xush Kelibsiz!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Dunyo miqyosidagi real-time messaging platformasi
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Zap className="text-primary-500 mb-3 mx-auto" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Tez va Ishonchli</h3>
            <p className="text-gray-600">Real-time xabar almashish</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Users className="text-primary-500 mb-3 mx-auto" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Global Hamjamiyat</h3>
            <p className="text-gray-600">Butun dunyo bo'ylab foydalanuvchilar</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Shield className="text-primary-500 mb-3 mx-auto" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Xavfsiz</h3>
            <p className="text-gray-600">Shaxsiy ma'lumotlaringiz himoyalangan</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <MessageCircle className="text-primary-500 mb-3 mx-auto" size={32} />
            <h3 className="font-semibold text-gray-800 mb-2">Ko'p qirrali</h3>
            <p className="text-gray-600">Shaxsiy va guruh chatlari</p>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h4 className="font-semibold text-primary-800 mb-2">Boshlash uchun</h4>
          <p className="text-primary-600">
            • Qidiruv bo'limida yangi kontakt qidiring<br/>
            • Xabarlarni real-time yuboring va oqing<br/>
            • Profilingizni sozlang<br/>
            • Global hamjamiyatga qo'shiling
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;