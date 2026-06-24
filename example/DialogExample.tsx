import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useDialog } from 'fox-ecom';

const DialogExample: React.FC = () => {
  const dialog = useDialog();

  const handleAlert = async () => {
    await dialog.alert({
      title: '🎉 Success',
      message: 'Dialog engine is working perfectly!',
      button: {
        label: 'Awesome!',
        style: 'primary',
      },
    });
  };

  const handleConfirm = async () => {
    const result = await dialog.confirm({
      title: '⚠️ Confirm Action',
      message: 'Do you want to proceed?',
      confirmButton: {
        label: 'Yes, proceed',
        style: 'primary',
      },
      cancelButton: {
        label: 'No, cancel',
      },
    });
    console.log('Confirm result:', result);
  };

  const handleInput = async () => {
    const name = await dialog.input({
      title: '📝 Enter Name',
      message: 'What is your name?',
      placeholder: 'Type your name...',
      defaultValue: '',
    });
    if (name) {
      dialog.toast({
        message: `Hello, ${name}! 👋`,
        variant: 'success',
      });
    }
  };

  const handleCustom = async () => {
    await dialog.custom({
      title: '🎨 Custom Dialog',
      content: (
        <View>
          <Text style={styles.customText}>This is a custom dialog</Text>
          <Text style={styles.customSubtext}>You can add any React component here</Text>
        </View>
      ),
      buttons: [
        {
          label: 'Close',
          onPress: () => {},
        },
      ],
    });
  };

  const handleToast = () => {
    const variants = ['success', 'error', 'warning', 'info'] as const;
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    dialog.toast({
      message: `This is a ${randomVariant} toast! ✨`,
      variant: randomVariant,
      duration: 3000,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Dialog Engine Demo</Text>
        <Text style={styles.subtitle}>All dialog types with full features</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAlert}>
        <Text style={styles.buttonText}>Alert Dialog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Dialog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleInput}>
        <Text style={styles.buttonText}>Input Dialog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCustom}>
        <Text style={styles.buttonText}>Custom Dialog</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleToast}>
        <Text style={styles.buttonText}>Toast Notification</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📚 Dialog Types Supported:</Text>
        <Text style={styles.infoBullet}>✓ Alert - Simple message with OK button</Text>
        <Text style={styles.infoBullet}>✓ Confirm - Yes/No confirmation</Text>
        <Text style={styles.infoBullet}>✓ Input - Text input dialog</Text>
        <Text style={styles.infoBullet}>✓ Custom - Any React component</Text>
        <Text style={styles.infoBullet}>✓ Toast - Brief notification</Text>
      </View>

      <View style={styles.usageBox}>
        <Text style={styles.usageTitle}>💡 Usage Example:</Text>
        <Text style={styles.usageCode}>{`const { alert, confirm, input } = useDialog();\n\nawait alert({\n  title: 'Title',\n  message: 'Message',\n  button: { label: 'OK' }\n});`}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#e3f2fd',
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  usageBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  usageCode: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    lineHeight: 18,
  },
  customText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  customSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default DialogExample;
