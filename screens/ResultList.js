import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const ResultList = ({result}) => {
    return (
        <View style={{flex:1}}>
            <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                data={result}
                keyExtractor={(result) => result.id}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.container}>
                            <Image style={styles.image} source={{ uri: item.image_url }} />
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.name}>
                                {item.rating} Stars, {item.review_count} Reviews
                            </Text>
                        </View>
                    );
                }}
            ></FlatList>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15
    },
    image: {
        width: 250,
        height: 120,
        borderRadius: 4,
        marginBottom: 5
    },
    name: {
        fontWeight: "bold",
        color:'white'
    }
});

export default ResultList;