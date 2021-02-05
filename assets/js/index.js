document.getElementById('init').onclick = function() {
const cam = document.getElementById('cam')

    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        if (Array.isArray(devices)) {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    if (device.label.includes('')) {
                        navigator.getUserMedia(
                            { video: {
                                deviceId: device.deviceId
                            }},
                            stream => cam.srcObject = stream,
                            error => console.error(error)
                        )
                    }
                }
            })
        }
    })

    const loadLabels = () => {
    const labels = ['Samuel Vieira','Esther Vieira','Gabriel Cezar']
    console.log(labels);

    return Promise.all(labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 1; i++) {
            const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/${i}.png`)
            const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor()
            descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }))
}


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'),
])


cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    
    const labels = await loadLabels()
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)

    // 
    
    setInterval(async () => {

        const detections = await faceapi
            .detectAllFaces(
                cam,
                new faceapi.TinyFaceDetectorOptions()
            )            
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, canvasSize)
        const faceMatcher = new faceapi.FaceMatcher(labels, 0.6)
        const results = resizedDetections.map(d =>
            faceMatcher.findBestMatch(d.descriptor)
        )
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        resizedDetections.forEach(detection => {
            const { age, gender, genderProbability } = detection
            new faceapi.draw.DrawTextField([
                `${parseInt(age, 10)} anos`,
                `${gender} (${parseInt(genderProbability * 100, 10)})`
            ], detection.detection.box.topRight).draw(canvas)
        })
        
        
        results.forEach((result, index) => {
            
                const box = resizedDetections[index].detection.box
                const { label, distance } = result
                new faceapi.draw.DrawTextField([
                    `${label}`
                ], box.bottomRight).draw(canvas)

                if (label == 'Desconhecido') {
                    if (window.confirm('Usuário não verificado, clique em OK para fazer o cadastro' , window.location.reload())){
                        window.location.href(`htttps://google.com.br`);
                    }
                }

                else {
                    fetch(`/assets/lib/face-api/labels/${label}/matricula.txt`)
                    .then( response => response.text())
                    .then( matricula => {
                        if (matricula.length == 4) {
                            return window.alert(` Usuário Verificado!\n Nome do Funcionário: ${label}.\n Número de matrícula do Funcionário: ${matricula}.` , window.location.reload() );
                        }

                        return window.alert(`Usuário Verificado, porém a matrícula não foi encontrada...`, window.location.reload() ); 
                    })
                }
        
        })
    } , 0)
})
}






// ////////////////// CODIGOS Q USEI MAS NAO USO MAIS ////////////////////////////

// fetch(`/assets/lib/face-api/labels/${label}/matricula.txt`)
                    // .then( response => response.text())
                    // .then( matricula => {
                    //     if (matricula.length < 5) {
                    //         return window.alert(`Usuário Verificado! Seu número de matrícula é: ${matricula}`, window.location.reload() ) 
                    //     }

                    //     return window.alert(`Usuário Verificado, porém a matrícula não foi encontrada...`, window.location.reload() ) 
                    // })
                    
                    // matricula = 4699                
                    // window.alert(`Usuário Verificado! Seu número de matrícula é: ${matricula}`); 
                    // window.location.reload()

////////////////////////////////////////////////////////////////////////////////////////////
// label = 'Samuel'

// fetch(`/assets/lib/face-api/labels/${label}/matricula.txt`)
//                     .then( response => response.text() )
//                     .then( matricula => window.alert(`Usuário Verificado! Seu número de matrícula é: ${matricula}`) )

//                     window.alert(matricula)

// fetch(`/assets/lib/face-api/labels/${label}/matricula.txt`)

// fetch(`/assets/lib/face-api/labels/${label}/matricula.txt`)
//                     .then( response => response.text() )
//                     .then( matricula => window.alert(`Usuário Verificado! Seu número de matrícula é: ${matricula}`) )


// /////////////////////////////////////////////////////////////////////

// if (label === `${label}`) {

    //         if (window.confirm('Usuário Verificado! Seu número de matrícula é: 6499')){
    //             window.location.reload()
    //         }
            
    //     } else {
    //         if(window.confirm('Usuário não Identificado.')){
    //         window.location.reload()
    //         }    
    // }