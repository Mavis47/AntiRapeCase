import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/auth.context";

export default function Query() {

    const [query,setQuery] = useState<string>();
    const { isAuthenticated } = useAuth();

    const handleQuery = async(e: React.FormEvent) => {
        e.preventDefault();
        const response =  await axios.post("http://localhost:5001/api/query/add-query",
            {
                query
            },
            {
            headers: {
                'Authorization': `Bearer ${isAuthenticated}`
            },
        })
        console.log("Query submitted successfully:", response.data);
        alert("Query Added")
        setQuery(""); 
    }


  return (
    <div>
        <h1>Query</h1>
        <form onSubmit={handleQuery}>
            <input type="text" name="text" placeholder="Ask Query?" onChange={(e) => setQuery(e.target.value)}/><br />
            <button type="submit" className="border-t-cyan-500">Search</button>
        </form>
    </div>
  )
}
