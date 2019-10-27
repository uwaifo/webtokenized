import {Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx} from 'type-graphql'
import {User} from './entity/User'
import { hash, compare } from 'bcryptjs'
//import { sign } from 'jsonwebtoken';
import {MyContext} from './MyContext'
import { createRefreshToken, createAccessToken } from './auth';

//Object type
@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}


//Resolvers
@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello dear"
    }

    @Query(() => [User])
    users() {
        return User.find()
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {
        const hashedPassword = await hash(password, 12)
        try {
            await User.insert({
                email,
                password: hashedPassword
            })
            
        } catch (error) {
            console.log(error)
            return false
        }
        return true            
    }

    @Mutation(() => LoginResponse)
    async login(
        @Ctx() {res}: MyContext,
        @Arg('email') email: string,
        @Arg('password') password: string,
     ): Promise<LoginResponse> {
        const user = await User.findOne({ where: {email}})
        if(!user) {
            throw new Error("Couldnt find that user ")
        }
        const valid =  await compare(password, user.password)
        if(!valid) {
            throw new Error("hahha invalid password man !!! Try again !")
        }

        //sucessfully loged in 
        res.cookie("efua",createRefreshToken(user)
        )
        return {
            accessToken: createAccessToken(user)
        }
    }
}