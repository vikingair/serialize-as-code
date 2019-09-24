type CustomSerializer = (o: any) => string | void;
type SerializerType = {
    run: (o: any) => string;
    create: (custom: CustomSerializer) => (o: any) => string;
};

export const Serializer: SerializerType;
