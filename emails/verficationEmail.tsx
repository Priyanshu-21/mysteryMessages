import {
    Html, 
    Head,
    Font,
    Preview, 
    Heading, 
    Row, 
    Section, 
    Text, 
    Button,
    Body, 
} from '@react-email/components';

interface verificationEmailProps {
    username: string; 
    otp: string; 
}

export default function verificationEmail({ username, otp }: verificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <Heading as='h1'>Vefication Code</Heading>
                <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                format: "woff2",
                    }}
                fontWeight={400}
                fontStyle="normal"
                />
            </Head>
            <Preview>Here &apos;s your verfication code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thanks for registering. Please use the following verfication code to complete your registration.
                    </Text>
                </Row>
                <Text>{otp}</Text>
            </Section>
        </Html> 
    );
}