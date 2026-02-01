import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import LostAndFound from "./pages/LostAndFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateItem from "./pages/CreateItem";
import ItemDetail from "./pages/ItemDetail";
import EditItem from "./pages/EditItem";
import ContactOwner from "./pages/ContactOwner";
import Inbox from "./pages/Inbox";
import ReplyMessage from "./pages/ReplyMessage";
import Conversation from "./pages/Conversation";


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lostandfound" element={<LostAndFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/items/:id/contact" element={<ContactOwner />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/messages/:messageId/reply" element={<ReplyMessage />} />
        <Route path="/conversation/:itemId/:userId" element={<Conversation />}/>
/>

      </Routes>
    </Router>
  );
}

export default App;
