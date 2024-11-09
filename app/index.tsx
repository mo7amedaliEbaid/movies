import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';

interface TVShow {
  id: number;
  name: string;
  network: string;
  start_date: string;
  status: string;
  image_thumbnail_path: string;
}

interface TVShowDetails {
  id: number;
  name: string;
  description: string;
  start_date: string;
  status: string;
  network: string;
  genres: string[];
  image_path: string;
}

const App: React.FC = () => {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedShow, setSelectedShow] = useState<TVShowDetails | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        const response = await axios.get('https://www.episodate.com/api/most-popular?page=1');
        setTvShows(response.data.tv_shows);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  const fetchTVShowDetails = async (id: number) => {
    try {
      const response = await axios.get(`https://www.episodate.com/api/show-details?q=${id}`);
      setSelectedShow(response.data.tvShow);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const renderTVShow = ({ item }: { item: TVShow }) => (
    <TouchableOpacity onPress={() => fetchTVShowDetails(item.id)} style={styles.card}>
      <Image source={{ uri: item.image_thumbnail_path }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.text}>Network: {item.network}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>
        <Text style={styles.text}>Start Date: {item.start_date}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tvShows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTVShow}
      />

      {/* Modal for TV Show Details */}
      {selectedShow && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedShow.image_path }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedShow.name}</Text>
            <Text style={styles.modalText}>{selectedShow.description}</Text>
            <Text style={styles.modalText}>Network: {selectedShow.network}</Text>
            <Text style={styles.modalText}>Status: {selectedShow.status}</Text>
            <Text style={styles.modalText}>Start Date: {selectedShow.start_date}</Text>
            <Text style={styles.modalText}>Genres: {selectedShow.genres.join(', ')}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#0000ff',
    padding: 10,
    marginTop: 20,
    marginBottom:40,
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
