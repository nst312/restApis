class CoustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CoustomErrorHandler(409, message)
    }

    static wrongCradentials(message= "usernamee or password not found!") {
        return new CoustomErrorHandler(409, message)
    }
}
export default CoustomErrorHandler