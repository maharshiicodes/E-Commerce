import supabase from '../supabaseClient.ts';

export const signUpUser = async(email : string , password : string , name : string) => {
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options : {
            data : {
                first_name : name
            }
        }
    });
    return {data , error} ;
}

export const signInUser = async(email : string, password : string)=> {
   const {data , error} = await supabase.auth.signInWithPassword({
    email,
    password
   });
   return {data , error};
}

export const signOut = async () => {
    const {error} = await supabase.auth.signOut();
    return {error};
}