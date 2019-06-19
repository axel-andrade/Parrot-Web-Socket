import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Container, Header, Content, Text, Right, Body, Title, Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

export default class Main extends Component {
    state = {
        message: '',
        messages: [],

    }

    componentDidMount = async () => {
     
        try {
            let messages = await AsyncStorage.getItem('@Parrot_messages');
            if (messages) {
                this.setState({ messages: JSON.parse(messages) });
            }
        } catch (error) {
            this.setState({ messages: [] })
        }
    }

    sendMessage = (message) => {
        this.setState({ message: '' });
        var ws = new WebSocket('ws://echo.websocket.org');

        ws.onopen = () => {
            console.log('connection opened');
            ws.send(message); // send a message
        };

        ws.onmessage = (e) => {
            console.log(e.data);
            this.updateMessages(message, e.data);
        };

        ws.onerror = (e) => {
            // an error occurred
            Alert.alert("Ops, ocorreu algum problema : (");
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
        };

    }
    updateMessages = async (message, echo) => {
        let data = [...this.state.messages];
        data.push(message);
        data.push(echo);

        this.setState({ messages: data });
        await AsyncStorage.setItem('@Parrot_messages', JSON.stringify(data));

    }
    renderMessages = (item, index) => {

        if (index % 2 == 0)
            return (
                <View style={{ paddingRight: '30%', paddingTop: '5%' }}>
                    <Text style={{ backgroundColor: '#E6E6FA', alignItems: 'flex-start', paddingTop: '3%', paddingBottom: '3%', paddingLeft: '5%', color: '#555555', borderRadius: 10 }}> {item}</Text>
                </View>
            );
        else
            return (
                <View style={{ paddingLeft: '30%', paddingTop: '5%' }}>
                    <Text style={{ backgroundColor: '#6AA84F', alignItems: 'flex-end', paddingTop: '3%', paddingBottom: '3%', paddingLeft: '5%', color: 'white', borderRadius: 10 }}> {item}</Text>
                </View>
            );
    }

    clearMessages = async () => {
        this.setState({ messages: [] })
        await AsyncStorage.clear();
    }

    componentWillUnmount() {
    
    }

    render() {
        let { message, messages } = this.state;
        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }}>
                    <Body>
                        <Title style={{ color: '#6AA84F' }}>Mensagens</Title>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={() => this.clearMessages()}>
                            <Text style={{ color: '#6AA84F' }}>Limpar</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>
                <Content padder>
                    <ScrollView ref={(scroll) => { this.scroll = scroll; }}>

                        <FlatList
                            data={messages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => this.renderMessages(item, index)}

                        />
                    </ScrollView>
                </Content>
                <Item style={{ padding: '5%', paddingBottom: '3%', backgroundColor: 'transparent' }}>
                    <Input
                        placeholder="Enviar mensagem"
                        style={{ color: '#555555', borderWidth: 1, borderColor: '#6AA84F', borderRadius: 24, paddingLeft: '5%' }}
                        placeholderTextColor='#555555'
                        value={message}
                        onChangeText={(text) => this.setState({ message: text })}
                    />
                    {
                        message.length > 0
                            ? < TouchableOpacity style={{ paddingLeft: '5%' }} onPress={() => this.sendMessage(message)}>
                                <Icon name="paper-plane" size={30} color="#6AA84F" />
                            </TouchableOpacity>

                            : <View style={{ paddingLeft: '5%' }}>
                                <Icon name="paper-plane" size={30} color="gray" />
                            </View>
                    }


                </Item>

            </Container >
        );
    }
}
