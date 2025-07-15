import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import { askAgent } from "../api/AgentApi";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-stretch p-4">
        <aside className="w-1/4 max-w-xs bg-white shadow rounded-lg p-5 overflow-y-auto">
          <FileUpload />
        </aside>
        <Chat onSend={askAgent} />
      </main>
    </div>
  );
};

export default Home;
