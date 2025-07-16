import { useEffect } from "react";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import { askAgent, getUserDocs } from "../api/AgentApi";
import { useAppContext } from "../context/AppContext";

const Home: React.FC = () => {
  const { setUserDocs, setHasDocs, setInitialLoading } = useAppContext();

  useEffect(() => {
    const checkFiles = async () => {
      try {
        setInitialLoading(true);

        const docs = await getUserDocs();
        console.log("User documents:", docs);

        setHasDocs(docs.length > 0);
        setUserDocs(docs);
        setInitialLoading(false);
      } catch (error) {
        console.error("Error checking files:", error);
        setHasDocs(false);
      }
    };
    checkFiles();
  }, []);

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
