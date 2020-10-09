import React, { Component } from 'react';
import {
    Share,
    Text,
    TouchableOpacity
} from 'react-native';

const shareOptions = {
    title: 'Gracias por tu Compra!',
    message: 'Muchas gracias por tu pedido! Tu orden es la numero: <nro de orden> El monto de tu orden es: $<Monto> El estado es: <Estado de la orden>', // Note that according to the documentation at least one of "message" or "url" fields is required
    url: 'www.example.com',
    subject: 'Subject'
};

export default class ShareExample extends React.Component {

    onSharePress = () => Share.share(shareOptions);

    render() {
        return (
            <TouchableOpacity onPress={this.onSharePress} >
                <Text>Share data</Text>
            </TouchableOpacity>
        );
    }
}