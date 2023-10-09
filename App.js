import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyB8pjXgCYXQAVLyOUK8g5QrvPf9nhrp6tI",
  authDomain: "shoplist-f5b58.firebaseapp.com",
  projectId: "shoplist-f5b58",
  storageBucket: "shoplist-f5b58.appspot.com",
  messagingSenderId: "307778128752",
  appId: "1:307778128752:web:ccc82842f51ce03a031db5"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoplist, setShoplist] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'shoplist/');
    onValue(itemsRef, snapshot => {
      const data = snapshot.val();
      let products;
      if(data) {
        products = data ? Object.keys(data).map(key => ({ key, ...data[key] })) : [];
      } else {
        products = [];
      }
      setShoplist(products);
      console.log(products.length, 'items read');
    });
  }, []);

  const saveShoplist = () => {
    push(
      ref(database, 'shoplist/'),
      {'product': product, 'amount': amount });
      setAmount('');
      setProduct('');
      Keyboard.dismiss();
  }

  const deleteItem = (key) => {
    console.log('deleteItem', key, shoplist.find(item => item.key === key));
    remove(ref(database, 'shoplist/' + key));
  }



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textbox}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product} />
      <TextInput
        style={styles.textbox}
        placeholder='Amount'
        onChangeText={amount => setAmount(amount)}
        value={amount} />
      <View style={{ paddingTop: 5 }}>
        <Button onPress={saveShoplist} title="Save" />
      </View>
      <Text style={{ fontSize: 18, paddingTop: 20 }}>Shopping list</Text>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={shoplist}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 15 }}>{`${item.product} ${item.amount} `}</Text>
            <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.key)}>delete</Text>
          </View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50
  }, textbox: {
    borderWidth: 1,
    borderColor: 'grey',
    width: 200,
    marginTop: 5,
  }, listcontainer: {
    marginTop: 5,
    alignContent: 'center',
    flexDirection: 'row',
  }
});


