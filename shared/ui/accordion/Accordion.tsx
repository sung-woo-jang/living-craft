import { colors } from '@toss/tds-colors';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccordionProps {
  title: string;
  content: string;
}

/**
 * 아코디언 컴포넌트
 * FAQ 등에서 사용하는 확장 가능한 패널
 */
export const Accordion = ({ title, content }: AccordionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.icon}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.grey200,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.grey900,
    paddingRight: 12,
  },
  icon: {
    fontSize: 24,
    color: colors.blue500,
    fontWeight: '300',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.grey100,
  },
  contentText: {
    fontSize: 14,
    color: colors.grey700,
    lineHeight: 22,
  },
});
