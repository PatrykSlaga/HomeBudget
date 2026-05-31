import React, { createContext, useState, useEffect } from 'react';
import { User } from '../../backend/models/User';
import { UserService } from '../../backend/services/userService';

type UserContextType = {
    user: User | null;
    save: (u: User) => Promise<void>;
    changeCurrency: (currencyCode: string) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const load = () => {
        const currentUser = UserService.get();
        setUser(currentUser);
    };

    const save = async (u: User) => {
        UserService.save(u);
        load();
    };

    const changeCurrency = (currencyCode: string) => {
        if (!user) return;
        // 1. Zapis w bazie danych
        UserService.updateCurrency(user.id, currencyCode);
        // 2. Zmiana w pamięci globalnej (React od razu to zauważy)
        setUser({ ...user, currency: currencyCode });
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <UserContext.Provider value={{ user, save, changeCurrency }}>
            {children}
        </UserContext.Provider>
    );
};