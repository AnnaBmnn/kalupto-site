import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Snow
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Resource
        this.resources = 
        [
            this.resources.items.snowFlakeTexture1,
            this.resources.items.snowFlakeTexture2,
            this.resources.items.snowFlakeTexture3,
            this.resources.items.snowFlakeTexture4,
        ]


        console.log(this.resource)

        this.parameters = [
            [[ 0.0, 0.0, 1.0 ], this.resources[0], 1.0 ],
            [[ 0.0, 0.0, 1.0 ], this.resources[1], 0.9 ],
            [[ 0.0, 0.0, 1.0 ], this.resources[2], 0.7 ],
            [[ 0.0, 0.0, 1.0 ], this.resources[3], 0.5 ],
        ]

        /*
        parameters = [
            [[ 1.0, 0.2, 0.5 ], sprite2, 20 ],
            [[ 0.95, 0.1, 0.5 ], sprite3, 15 ],
            [[ 0.90, 0.05, 0.5 ], sprite1, 10 ],
            [[ 0.85, 0, 0.5 ], sprite5, 8 ],
            [[ 0.80, 0, 0.5 ], sprite4, 5 ]
        ]
        */

        // Geometry
        this.geometry = new THREE.BufferGeometry()

        // Vertices
        this.vertices = []
        this.setVertices()

        this.setGeometry()

        // Materials
        this.materials = []

        // Points
        this.setPoints()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Snow')

            /*
            this.debugFolder
                .add(this.geometry.position, 'x')
                .name('position x')
                .min(-100)
                .max(100)
                .step(0.01)
            */
            
        }
    }

    setVertices()
    {
        for ( let i = 0; i < 5000; i ++ ) {

            const x = Math.random() * 200 - 100
            const y = Math.random() * 200 - 100
            const z = Math.random() * 200 - 100

            this.vertices.push( x, y, z )

        }
    }

    setGeometry()
    {
        this.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( this.vertices, 3 ) )
    }

    setPoints()
    {
        for ( let i = 0; i < this.parameters.length; i ++ ) {

            const color = this.parameters[ i ][ 0 ]
            const sprite = this.parameters[ i ][ 1 ]
            const size = this.parameters[ i ][ 2 ]

            this.materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending,  depthTest: false, transparent: true, sizeAttenuation: true, alphaMap: sprite } )
            this.materials[ i ].color = new THREE.Color('#ffffff')

            const particles = new THREE.Points( this.geometry, this.materials[ i ] )

            particles.rotation.x = Math.random() * 6
            particles.rotation.y = Math.random() * 6
            particles.rotation.z = Math.random() * 6

            this.scene.add( particles )
            console.log(particles)

        }
    }
    

    update()
    {
        if(this.experience){
            //let _scale = this.experience.world.audio.frequenceAverage * 0.005
            //this.model.scale.set(_scale, _scale, _scale)
            for ( let i = 0; i < this.scene.children.length; i ++ ) {

                const object = this.scene.children[ i ];

                if ( object instanceof THREE.Points ) {

                    object.rotation.y = this.time.elapsed * 0.00001 * i * ( i < 4 ? i + 1 : - ( i + 1 ) );

                }

            }
        }

    }
}