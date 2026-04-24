import { useEffect, useState } from 'react';
import { User } from '../models/User';
import { UserService } from '../services/userService';

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);

    const load = async () => {
        setUser(await UserService.get());
    };

    const save = async (u: User) => {
        await UserService.save(u);
        await load();
    };

    useEffect(() => {
        load();
    }, []);

    return { user, save };
};