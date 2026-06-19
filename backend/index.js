import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/player/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;

        if (!name || !tag) {
            return res.status(400).json({ error: "Missing player name or tag." });
        }

        console.log(`Fetching Account data for ${name}#${tag}...`);
        
        const account = await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`, {
            headers: { 'Authorization': process.env.HENRIK_API_KEY }
        });
        
        const region = account.data.data.region;

        console.log(`Fetching Matches and MMR data...`);
        
        const [matches, mmr] = await Promise.all([
            axios.get(`https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}?size=5`, {
                headers: { 'Authorization': process.env.HENRIK_API_KEY }
            }),
            axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${name}/${tag}`, {
                headers: { 'Authorization': process.env.HENRIK_API_KEY }
            })
        ]);

        res.json({
            profile: account.data.data,
            matches: matches.data.data,
            mmr: mmr.data.data
        });
        
    } catch (err) {
        console.error("Error fetching data:", err.message);
        if (err.response) {
            return res.status(err.response.status).json({ 
                error: err.response.data?.message || "External API Error" 
            });
        }
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
