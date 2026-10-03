import { useState } from 'react'
import { 
  Bot, 
  Mic, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState<'student' | 'lecturer'>('student')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                AIVES
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0-alpha
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-medium">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sinh viên
              </button>
              <button
                onClick={() => setActiveTab('lecturer')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'lecturer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Giảng viên
              </button>
            </div>

            <button className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5">
              <span>Đăng nhập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI-Powered Viva Exam System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Nền tảng thi vấn đáp tự động ứng dụng <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Trí tuệ nhân tạo</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Frontend được khởi tạo với <strong>React 19 + TypeScript + Vite + TailwindCSS</strong>, sẵn sàng kết nối cùng Spring Boot Monolith backend và hệ sinh thái AI.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group shadow-lg hover:shadow-indigo-500/10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mt-4 text-white">Phòng thi tương tác (Viva Room)</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Tích hợp MediaRecorder & Web Audio API, Google STT chuyển đổi giọng nói tiếng Việt, tự động nhận diện ngắt quãng và phát audio câu hỏi (TTS).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group shadow-lg hover:shadow-purple-500/10">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mt-4 text-white">Gemini Flash AI</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Đánh giá câu trả lời theo rubric, chủ động đặt câu hỏi xoáy (follow-up questions) bám sát kiến thức thực tế với độ trễ thấp.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mt-4 text-white">Thẩm định & Chấm điểm (HITL)</h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Human-In-The-Loop đảm bảo tính chính xác, minh bạch. Giảng viên trực tiếp xem lại bản ghi transcript, phúc khảo và thẩm định điểm.
            </p>
          </div>
        </div>

        {/* Tech Stack Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-200">Cấu trúc công nghệ Frontend:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">React 19</span>
            <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">TypeScript</span>
            <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">Vite</span>
            <span className="px-3 py-1 rounded-md bg-indigo-900/50 text-indigo-300 border border-indigo-700/60 font-mono">TailwindCSS v4</span>
            <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">Lucide React</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        AI-powered Viva Exam System (AIVES) &bull; SWD392 Group 4
      </footer>
    </div>
  )
}
