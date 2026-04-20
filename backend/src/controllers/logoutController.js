

//Array de funciones
const logoutController = {}

logoutController.logout = async (req, res) =>{
    res.clearCookie("AuthCookie")

    return res.status(200).json({message: "Sign out"});
}
export default logoutController