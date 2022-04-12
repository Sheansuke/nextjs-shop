import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No se ha definido la variable de entorno JWT_SECRET_SEED");
  }

  const token = jwt.sign(
    {
      _id,
      email,
    },
    process.env.JWT_SECRET_SEED,
    {
        expiresIn: "24h",
    }
  );

  return token
};


export const isValidToken = (token: string): Promise<string> => {

  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No se ha definido la variable de entorno JWT_SECRET_SEED");
  }

  return new Promise((resolve, reject) => {

    try {
      jwt.verify(token,process.env.JWT_SECRET_SEED || "", (err,payload)=>{
        if(err) return reject(err)

        const {_id} = payload as {_id: string}

        resolve(_id)
      })
      
    } catch (error) {
      reject(error)
      
    }

  })
}