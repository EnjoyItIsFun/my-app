declare namespace NodeJS {
    interface Global {
      mongoose: {
        Card?: mongoose.Model<CardType>;
        User?: mongoose.Model<UserType>;
      };
    }
  }
  

  interface CardType {
    title: string;
    image: string;
    description: string;
    url: string;
  }
  
  interface UserType {
    email: string;
    password: string;
  }
  