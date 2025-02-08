import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, storage } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

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
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadImage(uri);
    }
  };

  // Upload Image to Firebase Storage
  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `uploads/${Date.now()}.jpg`;

      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          setUploading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Page</Text>

      {/* Display an image */}
      <Image source={{ uri: "https://source.unsplash.com/400x300/?nature,technology" }} style={styles.image} />

      {/* Upload Image */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* Show Uploaded Image */}
      {uploading && <ActivityIndicator size="large" color="#007BFF" />}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />}

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
