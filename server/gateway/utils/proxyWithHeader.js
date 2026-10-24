import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl)=>{
    try {
        return proxy(serviceUrl, {
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                if(srcReq.user){
                    proxyReqOpts.headers['x-user-id'] = srcReq.user.userId
                }
                
                return proxyReqOpts;
            }
        })
    } catch (error) {
        console.log(`Error in proxyWithHeader: ${error}`);
    }
}