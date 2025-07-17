import { useEffect } from "react";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import DeleteButton from "../components/DeleteButton";
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

      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4">
        <aside className="w-full md:w-1/4 max-w-xs bg-white shadow rounded-lg p-5 overflow-y-auto">
          <FileUpload />
        </aside>

        <div className="flex-grow flex flex-col min-h-0">
          <Chat onSend={askAgent} />
        </div>
      </main>

      <div className="absolute top-20 right-4">
        <DeleteButton />
      </div>
    </div>
  );
};

export default Home;
