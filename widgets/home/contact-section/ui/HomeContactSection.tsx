import { Card } from '@shared/ui';
import { colors } from '@toss/tds-colors';
import { TextField, Toast } from '@toss/tds-react-native';
import { useState } from 'react';
import { Clipboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * 홈페이지 문의하기 섹션
 * 간단한 문의 폼을 제공
 */
export const HomeContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = () => {
    // TODO: API 연동 - 문의 내용 전송
    console.log('문의 제출:', { name, email, message });
    // 폼 초기화
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    setToastMessage(`${label}이(가) 복사되었습니다`);
    setToastOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>문의하기</Text>
        <Text style={styles.subtitle}>궁금한 사항을 남겨주시면 빠르게 답변드리겠습니다</Text>
      </View>

      <Card style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
        <View style={styles.formGroup}>
          <TextField.Clearable
            variant="line"
            label="이름"
            value={name}
            onChangeText={setName}
            placeholder="성함을 입력해주세요"
          />
          <TextField.Clearable
            variant="line"
            label="이메일"
            value={email}
            onChangeText={setEmail}
            placeholder="이메일을 입력해주세요"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField.Clearable
            variant="line"
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
      </Card>

      <View style={styles.infoSection}>
        {[
          { label: '전화', value: '010-7637-0624' },
          { label: '이메일', value: 'seastory624@gmail.com' },
        ].map((info, index) => (
          <TouchableOpacity
            key={index}
            style={(index + 1) % 2 === 0 ? { width: '48%' } : { width: '48%', marginRight: '4%' }}
            onPress={() => handleCopyToClipboard(info.value, info.label)}
            activeOpacity={0.7}
          >
            <Card style={{ marginBottom: 16, paddingVertical: 12 }}>
              <Text style={styles.infoLabel}>{info.label}</Text>
              <Text style={styles.infoValue}>{info.value}</Text>
              <Text style={styles.copyHint}>탭하여 복사</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Toast open={toastOpen} text={toastMessage} position="bottom" duration={2} onClose={() => setToastOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  formGroup: {
    marginBottom: 5,
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
    justifyContent: 'flex-start',
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
  copyHint: {
    fontSize: 11,
    color: colors.grey500,
    marginTop: 6,
  },
});
