import { Header } from "@/components/Header";

export default function Guide() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#1A1F2C]">Руководство</h1>
        <p className="text-[#403E43]">Добро пожаловать в руководство по использованию нашего приложения. Здесь вы найдете полезные советы и инструкции.</p>
        <h2 className="text-2xl font-semibold mt-4 text-[#1A1F2C]">Раздел 1: Введение</h2>
        <p className="text-[#403E43]">В этом разделе мы обсудим основные функции приложения и как начать с ним работать.</p>
        <h2 className="text-2xl font-semibold mt-4 text-[#1A1F2C]">Раздел 2: Основные функции</h2>
        <p className="text-[#403E43]">Здесь вы найдете информацию о ключевых функциях приложения и как их использовать.</p>
        <h2 className="text-2xl font-semibold mt-4 text-[#1A1F2C]">Раздел 3: Часто задаваемые вопросы</h2>
        <p className="text-[#403E43]">В этом разделе собраны ответы на часто задаваемые вопросы пользователей.</p>
      </main>
    </div>
  );
}