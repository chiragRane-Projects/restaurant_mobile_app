import { AuthContext } from '@/context/authContext'
import { useRouter } from 'expo-router'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if(!loading && !user){
      router.replace('/authScreen')
    }
  }, [user, loading]);

  if(loading) return null;
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})