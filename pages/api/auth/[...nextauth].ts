import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credential from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
    Credential({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Correo:",
          type: "email",
          placeholder: "correo@example.com",
        },
        password: {
          label: "Contraseña:",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        const user = await dbUsers.checkUserEmailPassword(credentials!.email,credentials!.password)        
        return user
      },
    }),
    
  ],

  pages: {
    signIn: "/auth/login",
    newUser: "/auth/login"

  },

  session: {
    maxAge: 2592000,
    strategy: "jwt",
    updateAge: 86400,
  },

  callbacks: {
   async jwt ({token,account, user}) {
    if (account){
      token.accessToken = account.access_token
      switch (account.type) {
        case "oauth":
          token.user = await dbUsers.oAuthToDbUser(user?.email || "", user?.name || "")
          break ;

        case "credentials":
          token.user = user
          break;
      
        default:
          break;
      }
    }
    return token;
   },

   async session({session,token,user}){
    session.accessToken = token.accessToken
    session.user = token.user as any
    return session;
   }

  }
});
