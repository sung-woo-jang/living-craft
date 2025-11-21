import { colors } from '@toss/tds-colors';
import { TextField } from '@toss/tds-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 문의하기 섹션
 * 간단한 문의 폼을 제공
 */
export const HomeContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // TODO: API 연동 - 문의 내용 전송
    console.log('문의 제출:', { name, email, message });
    // 폼 초기화
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>문의하기</Text>
        <Text style={styles.subtitle}>궁금한 사항을 남겨주시면 빠르게 답변드리겠습니다</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <TextField variant="box" label="이름" value={name} onChangeText={setName} placeholder="성함을 입력해주세요" />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해주세요"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <TextField
            variant="box"
            label="문의 내용"
            value={message}
            onChangeText={setMessage}
            placeholder="문의하실 내용을 입력해주세요"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>문의하기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>전화</Text>
          <Text style={styles.infoValue}>02-1234-5678</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>이메일</Text>
          <Text style={styles.infoValue}>contact@livingcraft.com</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>운영시간</Text>
          <Text style={styles.infoValue}>평일 09:00 - 18:00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey600,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.grey900,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.grey900,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: colors.blue500,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    minWidth: 140,
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.grey600,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey900,
  },
});
