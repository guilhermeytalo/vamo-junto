import React from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import HomeScreen from "@/app/(home)/index";

export default function HomeLayout() {
    const colorScheme = useColorScheme();

    return (
        <HomeScreen></HomeScreen>
    );
}