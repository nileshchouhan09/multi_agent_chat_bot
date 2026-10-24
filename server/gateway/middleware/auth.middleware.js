import redis from "../../shared/redis/redis.js";

export const protect = async(req,res,next)=>{
    try{
        const sessionId = req.cookies?.sessionId;
        if(!sessionId){
            return res.status(401).json({
                error:"Unauthorized"
            })
        }
        const sessionData = await redis.get(`sessionId-${sessionId}`);
        if(!sessionData){
            return res.status(401).json({
                error:"Session expired or invalid"
            })
        }
        req.user = JSON.parse(sessionData);
        next(); 
    }
    catch(error){
        
        return res.status(500).json({
            message:`Protect error ${error}`
        })
    }
}


