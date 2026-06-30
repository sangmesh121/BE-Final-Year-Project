import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Container } from '../../../components/Container';
import { useTheme } from '../../../context/ThemeContext';
import { spacing } from '../../../theme/colors';
import { FontAwesome5 } from '@expo/vector-icons';

// Mock Data
const HELP_ARTICLES = [
    { id: '1', title: 'How to scan a product?', category: 'Scanning' },
    { id: '2', title: 'Understanding verification results', category: 'Verification' },
    { id: '3', title: 'Managing your subscription', category: 'Account' },
    { id: '4', title: 'Resetting your password', category: 'Account' },
    { id: '5', title: 'Why is my scan history empty?', category: 'Troubleshooting' },
    { id: '6', title: 'Supported stores for price check', category: 'Pricing' },
];

export const HelpCenterScreen = () => {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredArticles = HELP_ARTICLES.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
                    <FontAwesome5 name="search" size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search for help..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {filteredArticles.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No articles found.</Text>
                    </View>
                ) : (
                    filteredArticles.map((article) => (
                        <TouchableOpacity key={article.id} style={[styles.articleItem, { borderBottomColor: colors.border }]}>
                            <View>
                                <Text style={[styles.articleTitle, { color: colors.text }]}>{article.title}</Text>
                                <Text style={[styles.categoryBadge, { color: colors.primary }]}>{article.category}</Text>
                            </View>
                            <FontAwesome5 name="chevron-right" size={12} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        padding: spacing.m,
        borderBottomWidth: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        height: 44,
        borderRadius: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    content: {
        padding: spacing.m,
    },
    articleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.m,
        borderBottomWidth: 1,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    categoryBadge: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyState: {
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    }
});
