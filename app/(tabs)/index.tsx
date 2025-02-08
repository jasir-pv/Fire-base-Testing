import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { app, auth, storage } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, getStorage, uploadBytes } from "firebase/storage";
import { useRouter } from "expo-router";
import { collection, getDocs, getFirestore } from "firebase/firestore";

const HomeScreen = () => {
  const router = useRouter();

  const storage = getStorage();

  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const db = getFirestore(app)

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/login");
    } catch (error) {
      console.log(error.message);
    }
  };


  // Handle Image Picker and Upload
  const pickImage = async (event) => {
     const value = event.target.value;
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    value.image=image;
    console.log(value)

    // convert to uri to blob file

    const resp  = await fetch(image);
    const blob = await resp.blob();

    const storageRef = ref(storage, 'communityPost/'+Date.now()+".jpg");

    uploadBytes(storageRef, file).then((snapshot) => {
  console.log('Uploaded a blob or file!');
});


    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload Image to Firebase Storage

  const getImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'image_upload'))

  }


 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Page</Text>

      {/* Display an image */}
      <Image source={{ uri: "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" }} style={styles.image} />

      {/* Upload Image */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Show Uploaded Image */}
      {uploading && <ActivityIndicator size="large" color="#007BFF" />}
      {image && <Image source={{ uri: image }} value='image' style={styles.uploadedImage} />}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f4f4f4", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333" },
  image: { width: 300, height: 200, borderRadius: 10, marginBottom: 20 },
  uploadButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 8, width: "80%", alignItems: "center", marginVertical: 10 },
  logoutButton: { backgroundColor: "red", padding: 15, borderRadius: 8, width: "80%", alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  uploadedImage: { width: 250, height: 250, borderRadius: 10, marginTop: 20 },
});

export default HomeScreen;










// const uploadImage = async (uri) => {
//   setUploading(true);
//   try {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = `uploads/${Date.now()}.jpg`;

//     const storageRef = ref(storage, filename);
//     const uploadTask = uploadBytesResumable(storageRef, blob);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//       },
//       (error) => {
//         console.error("Upload failed", error);
//         setUploading(false);
//       },
//       async () => {
//         const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//         setImageUrl(downloadURL);
//         setUploading(false);
//       }
//     );
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     setUploading(false);
//   }
// };