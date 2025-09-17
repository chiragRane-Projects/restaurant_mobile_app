import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  // Center loading/error state
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 20,
  },

  // Header
  header: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    elevation: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 15,
    fontFamily: 'Outfit',
    color: '#fff',
    marginTop: 6,
    opacity: 0.9,
  },

  // Scroll container
  profileContainer: {
    padding: 20,
    paddingBottom: 120,
  },

  // Profile Card
  profileInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    color: '#222',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Outfit',
    color: '#666',
    marginTop: 3,
  },
  profileAddress: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: '#888',
    marginTop: 2,
  },

  // Actions
  actionContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 15,
    fontFamily: 'Outfit',
    color: '#333',
    marginLeft: 10,
  },

  // Sections
  chartSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    color: '#222',
    marginBottom: 12,
  },

  // Chart
  chartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    width: 160,
    height: 160,
    position: 'relative',
    borderRadius: 80,
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  legend: {
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    fontFamily: 'Outfit',
    color: '#444',
  },

  // Orders button
  viewOrdersButton: {
    backgroundColor: '#eb7d34',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
    elevation: 2,
  },
  viewOrdersButtonText: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: '#fff',
  },

  // Status texts
  loadingText: {
    fontSize: 14,
    fontFamily: 'Outfit',
    color: '#444',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Outfit',
    color: '#c0392b',
    marginTop: 10,
    textAlign: 'center',
  },
});
