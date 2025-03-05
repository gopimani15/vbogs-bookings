import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from '.';
import { NavigationContainer } from '@react-navigation/native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: null,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: 'Venues',
          headerTitle: 'Venues',
          tabBarLabel: 'Venues',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bed.double.circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="venuedetails/[id]"
        options={{
          title: 'Venue Details',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />




      <Tabs.Screen
        name="grounds"
        options={{
          title: 'Grounds',
          headerTitle: 'Grounds',
          tabBarLabel: 'Grounds',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tennis.racket" color={color} />,
        }}
      />

      <Tabs.Screen
        name="grounddetails/[id]"
        options={{
          title: 'Ground Details',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />

      <Tabs.Screen
        name="confirmation/[id]"
        options={{
          title: 'Booking Confirmation',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />

      <Tabs.Screen
        name="events/[hotelId]"
        options={{
          title: 'Events',
          headerTitle: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.clock" color={color} />,
        }}
      />

      <Tabs.Screen
        name="eventdetails/[id]"
        options={{
          title: 'Event Details',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />

    <Tabs.Screen
        name="payment/[id]"
        options={{
          title: 'Payment',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />

    <Tabs.Screen
        name="bookconfirmation/[id]"
        options={{
          title: 'Booking Confirmation',
          href: null,
          tabBarItemStyle: { display: 'none' }
        }}
      />




    </Tabs>
  );
}
