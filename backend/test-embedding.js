import axios from 'axios';

console.log('🧪 Testing Embedding Service...\n');

async function testEmbeddingService() {
    try {
        // Test 1: Health check
        console.log('1️⃣ Testing /health endpoint...');
        const healthResponse = await axios.get('http://localhost:5000/health');
        console.log('✅ Health check passed:', healthResponse.data);

        // Test 2: Single embedding
        console.log('\n2️⃣ Testing /embed endpoint...');
        const embedResponse = await axios.post('http://localhost:5000/embed', {
            text: 'Bismillahirrahmanirrahim'
        });
        console.log(`✅ Embedding generated!`);
        console.log(`   Dimension: ${embedResponse.data.dimension}`);
        console.log(`   First 5 values: [${embedResponse.data.embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);

        console.log('\n✨ All tests passed! Embedding service is working.\n');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        process.exit(1);
    }
}

testEmbeddingService();
