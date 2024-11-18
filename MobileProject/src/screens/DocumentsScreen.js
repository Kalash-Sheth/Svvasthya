import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Image,
  Text,
} from 'react-native';
import * as Paper from 'react-native-paper';
import {FileText, Download} from 'lucide-react-native';
import BRAND_COLORS from '../styles/colors';

export default function DocumentsScreen({route}) {
  const {documents} = route.params;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const showMessage = msg => {
    setMessage(msg);
    setVisible(true);
  };

  const openDocument = async url => {
    try {
      console.log('Opening document URL:', url);

      if (!url) {
        showMessage('Invalid document URL');
        return;
      }

      const fullUrl = url.startsWith('http') ? url : `http://${url}`;

      // For images, show in modal
      if (fullUrl.match(/\.(png|jpe?g|gif)$/i)) {
        setCurrentImageUrl(fullUrl);
        setImageModalVisible(true);
        return;
      }

      // For all other files, try to open in browser
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
        showMessage('Opening document in browser...');
      } else {
        showMessage('Cannot open this document type.');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      showMessage('Error opening document. Please try again.');
    }
  };

  const handleDownload = async url => {
    console.log('Downloading document:', url);
    await openDocument(url);
  };

  const renderDocumentItem = item => (
    <TouchableOpacity
      key={item.name}
      style={styles.documentItem}
      onPress={() => openDocument(item.url)}>
      <View style={styles.documentIconContainer}>
        <FileText size={24} color={BRAND_COLORS.primary} />
      </View>
      <View style={styles.documentInfo}>
        <Paper.Text style={styles.documentName}>{item.name}</Paper.Text>
        <Paper.Text style={styles.documentDate}>
          Uploaded on: {new Date(item.uploadDate).toLocaleDateString()}
        </Paper.Text>
      </View>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(item.url)}>
        <Download size={20} color={BRAND_COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <Paper.Text style={styles.headerText}>My Documents</Paper.Text>

        {documents.map(category => (
          <View key={category.type} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Paper.Text style={styles.sectionTitle}>
                {category.type}
              </Paper.Text>
              <Paper.Text style={styles.documentCount}>
                {category.items.length} document
                {category.items.length !== 1 ? 's' : ''}
              </Paper.Text>
            </View>
            <View style={styles.documentsList}>
              {category.items.map(renderDocumentItem)}
            </View>
          </View>
        ))}
      </ScrollView>

      <Paper.Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={styles.snackbar}>
        {message}
      </Paper.Snackbar>

      <Modal visible={imageModalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Image
            source={{uri: currentImageUrl}}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: BRAND_COLORS.secondary,
  },
  documentCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textSecondary,
  },
  documentsList: {gap: 10},
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${BRAND_COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {flex: 1},
  documentName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: BRAND_COLORS.textPrimary,
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: BRAND_COLORS.textSecondary,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${BRAND_COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbar: {backgroundColor: BRAND_COLORS.textPrimary},
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '90%',
    height: '80%',
  },
});
