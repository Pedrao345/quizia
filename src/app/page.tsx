export default function PaginaInicial() {
  return (
    <main className="flex-grow flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">
          Gerador de Questionário
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Informe um assunto para gerar 10 questões com 4 alternativas!
        </p>
        {/* Aqui será o formulário de entrada do assunto */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Ex: História do Brasil, Física Quântica..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="mt-4 w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-300">
            Gerar Questionário
          </button>
        </div>
      </div>
    </main>
  );
}